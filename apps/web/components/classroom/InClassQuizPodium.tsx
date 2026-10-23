'use client';

import React, { useState, useEffect } from 'react';

export interface QuizOptionDist {
  index: number;
  label: string;
  count: number;
  percentage: number;
  is_correct?: boolean | null;
}

export interface ActiveQuizState {
  quiz_id: string;
  prompt: string;
  options: string[];
  correct_option_index: number | null;
  duration_seconds: number;
  is_active: boolean;
  is_results_published: boolean;
  total_responses: number;
  distribution: QuizOptionDist[];
}

interface InClassQuizPodiumProps {
  sessionId: string;
  activeQuiz: ActiveQuizState | null;
  onLaunchQuiz: (quizData: {
    prompt: string;
    options: string[];
    correct_option_index: number | null;
    duration_seconds: number;
  }) => Promise<void>;
  onPublishResults: (quizId: string) => Promise<void>;
}

export function InClassQuizPodium({
  sessionId,
  activeQuiz,
  onLaunchQuiz,
  onPublishResults,
}: InClassQuizPodiumProps) {
  const [prompt, setPrompt] = useState('');
  const [quizType, setQuizType] = useState<'4-choice' | '2-choice'>('4-choice');
  const [duration, setDuration] = useState<number>(45);
  const [correctOption, setCorrectOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLaunch = async () => {
    setIsSubmitting(true);
    try {
      const options =
        quizType === '4-choice' ? ['الف', 'ب', 'ج', 'د'] : ['صحیح (درست)', 'غلط (نادرست)'];
      await onLaunchQuiz({
        prompt: prompt.trim() || 'پاسخ صحیح به تست مطرح‌شده روی تخته را انتخاب نمایید:',
        options,
        correct_option_index: correctOption,
        duration_seconds: duration,
      });
      setPrompt('');
      setCorrectOption(null);
    } catch (err) {
      console.error('Launch failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!activeQuiz) return;
    await onPublishResults(activeQuiz.quiz_id);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        color: '#f8fafc',
        direction: 'rtl',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🚀</span> سکوی کوییز و تست آنی کلاسی
        </h4>
        {activeQuiz && (
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              backgroundColor: activeQuiz.is_active ? '#10b981' : '#64748b',
              color: '#ffffff',
            }}
          >
            {activeQuiz.is_active ? 'کوییز در حال برگزاری' : 'کوییز پایان‌یافته'}
          </span>
        )}
      </div>

      {/* If a quiz is active or has results */}
      {activeQuiz ? (
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #334155',
          }}
        >
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#38bdf8', marginBottom: '8px' }}>
            {activeQuiz.prompt}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
            مجموع پاسخ‌های ثبت‌شده: <b style={{ color: '#f8fafc' }}>{activeQuiz.total_responses} نفر</b>
          </div>

          {/* Real-time bar chart of response distribution */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {activeQuiz.distribution.map((item) => {
              const isCorrect = item.index === activeQuiz.correct_option_index;
              return (
                <div key={item.index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: isCorrect ? 700 : 500, color: isCorrect ? '#4ade80' : '#e2e8f0' }}>
                      {item.label} {isCorrect && '✓ (پاسخ صحیح)'}
                    </span>
                    <span style={{ color: '#94a3b8' }}>
                      {item.count} نفر ({item.percentage}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      backgroundColor: '#1e293b',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percentage}%`,
                        height: '100%',
                        backgroundColor: isCorrect ? '#22c55e' : '#3b82f6',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Teacher Action Controls for Active Quiz */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {activeQuiz.is_active ? (
              <button
                type="button"
                onClick={handlePublish}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                پایان و انتشار پاسخ صحیح به کلاس
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setPrompt('')}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                }}
              >
                طراحی کوییز جدید
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Creator Form */
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
              عنوان یا صورت تست (اختیاری):
            </label>
            <input
              type="text"
              placeholder="مثلا: گزینه صحیح سوال ۵ روی تخته کدام است؟"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1e293b',
                border: '1px solid #475569',
                borderRadius: '6px',
                padding: '8px 10px',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                نوع گزینه‌ها:
              </label>
              <select
                value={quizType}
                onChange={(e) => setQuizType(e.target.value as any)}
                style={{
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '7px 8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value="4-choice">۴ گزینه‌ای (الف، ب، ج، د)</option>
                <option value="2-choice">۲ گزینه‌ای (صحیح / غلط)</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                مهلت پاسخ:
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                style={{
                  width: '100%',
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '6px',
                  padding: '7px 8px',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              >
                <option value={15}>۱۵ ثانیه</option>
                <option value={30}>۳۰ ثانیه</option>
                <option value={45}>۴۵ ثانیه</option>
                <option value={60}>۶۰ ثانیه</option>
                <option value={90}>۹۰ ثانیه</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
              تعیین گزینه صحیح (پیش از پرتاب):
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(quizType === '4-choice' ? ['الف', 'ب', 'ج', 'د'] : ['صحیح', 'غلط']).map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCorrectOption(correctOption === idx ? null : idx)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: '1px solid #475569',
                    backgroundColor: correctOption === idx ? '#10b981' : '#1e293b',
                    color: '#ffffff',
                    fontWeight: correctOption === idx ? 700 : 500,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleLaunch}
            style={{
              marginTop: '8px',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              cursor: isSubmitting ? 'wait' : 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>🎯</span> پرتاب فوری کوییز به کلاس
          </button>
        </div>
      )}
    </div>
  );
}
