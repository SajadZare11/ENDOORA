'use client';

import React, { useState, useEffect } from 'react';
import type { ActiveQuizState } from './InClassQuizPodium';

interface StudentQuizOverlayProps {
  quiz: ActiveQuizState;
  onSubmitAnswer: (quizId: string, optionIndex: number) => Promise<void>;
  onClose?: () => void;
}

export function StudentQuizOverlay({
  quiz,
  onSubmitAnswer,
  onClose,
}: StudentQuizOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [secondsLeft, setSecondsLeft] = useState<number>(quiz.duration_seconds || 45);

  useEffect(() => {
    if (!quiz.is_active || hasSubmitted) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz.is_active, hasSubmitted]);

  const handleSelect = async (index: number) => {
    if (hasSubmitted || !quiz.is_active || secondsLeft <= 0) return;
    setSelectedIndex(index);
    setHasSubmitted(true);
    try {
      await onSubmitAnswer(quiz.quiz_id, index);
    } catch (err) {
      console.error('Answer submission failed:', err);
    }
  };

  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / (quiz.duration_seconds || 45)) * 100));

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
        backdropFilter: 'blur(5px)',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '560px',
          padding: '28px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          border: '2px solid #3b82f6',
          textAlign: 'center',
        }}
      >
        {/* Header with Timer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.1rem' }}>
            <span>⚡</span> کوییز کلاسی آنلاین
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              backgroundColor: secondsLeft <= 5 ? '#ef4444' : '#334155',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            ⏱️ {secondsLeft} ثانیه
          </div>
        </div>

        {/* Progress Countdown Bar */}
        <div
          style={{
            height: '6px',
            backgroundColor: '#334155',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: secondsLeft <= 5 ? '#ef4444' : '#3b82f6',
              transition: 'width 1s linear',
            }}
          />
        </div>

        {/* Question Prompt */}
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#f1f5f9', marginBottom: '24px', lineHeight: 1.6 }}>
          {quiz.prompt || 'پاسخ صحیح به تست مطرح‌شده روی تخته را انتخاب کنید:'}
        </h3>

        {/* Options Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: quiz.options.length <= 2 ? '1fr 1fr' : '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {quiz.options.map((optionLabel, idx) => {
            const isSelected = selectedIndex === idx;
            const isPublished = quiz.is_results_published;
            const isCorrect = idx === quiz.correct_option_index;

            let bgColor = '#0f172a';
            let borderColor = '#475569';

            if (isSelected) {
              bgColor = '#1e3a8a';
              borderColor = '#3b82f6';
            }

            if (isPublished) {
              if (isCorrect) {
                bgColor = '#14532d';
                borderColor = '#22c55e';
              } else if (isSelected && !isCorrect) {
                bgColor = '#7f1d1d';
                borderColor = '#ef4444';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmitted || !quiz.is_active || secondsLeft <= 0}
                onClick={() => handleSelect(idx)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  color: '#ffffff',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: hasSubmitted || !quiz.is_active ? 'default' : 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>{optionLabel}</span>
                {isSelected && !isPublished && <span>✓</span>}
                {isPublished && isCorrect && <span>🌟 (صحیح)</span>}
              </button>
            );
          })}
        </div>

        {/* Status message */}
        {hasSubmitted && !quiz.is_results_published && (
          <div style={{ color: '#4ade80', fontSize: '0.95rem', fontWeight: 600 }}>
            ✓ پاسخ شما ثبت شد. منتظر اعلام نتایج توسط دبیر باشید...
          </div>
        )}

        {/* Published Class Distribution */}
        {quiz.is_results_published && (
          <div
            style={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #334155',
              marginTop: '12px',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
              📊 توزیع پاسخ‌های کل کلاس:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {quiz.distribution.map((item) => (
                <div key={item.index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '2px' }}>
                    <span>{item.label}</span>
                    <span>{item.percentage}% ({item.count} نفر)</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#334155', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        backgroundColor: item.index === quiz.correct_option_index ? '#22c55e' : '#3b82f6',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  marginTop: '16px',
                  padding: '8px 24px',
                  borderRadius: '8px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                بستن و بازگشت به تخته
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
