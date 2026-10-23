'use client';

import React from 'react';

export interface ParticipantInfo {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  isSpeaking: boolean;
  isMuted: boolean;
  hasHandRaised: boolean;
  handRaisedAt?: number;
  connectedSeconds: number;
  attendancePercentage: number;
}

interface ClassroomAttendeesPanelProps {
  participants: ParticipantInfo[];
  currentUserId: string;
  isTeacher: boolean;
  onGrantMic?: (studentId: string) => void;
  onMuteStudent?: (studentId: string) => void;
  onLowerHand?: (studentId: string) => void;
  onToggleRaiseHand?: () => void;
  myHandRaised?: boolean;
}

export function ClassroomAttendeesPanel({
  participants,
  currentUserId,
  isTeacher,
  onGrantMic,
  onMuteStudent,
  onLowerHand,
  onToggleRaiseHand,
  myHandRaised,
}: ClassroomAttendeesPanelProps) {
  const handRaisedList = participants.filter((p) => p.hasHandRaised);
  const teacher = participants.find((p) => p.role === 'teacher');
  const students = participants.filter((p) => p.role === 'student');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: '16px',
        color: '#f8fafc',
        direction: 'rtl',
      }}
    >
      {/* Student Hand-raising Action Bar */}
      {!isTeacher && onToggleRaiseHand && (
        <button
          type="button"
          onClick={onToggleRaiseHand}
          style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: myHandRaised ? '#f59e0b' : '#3b82f6',
            color: '#ffffff',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <span>✋</span>
          {myHandRaised ? 'پایین آوردن دست (انصراف از نوبت)' : 'دست بلند کردن (درخواست صحبت)'}
        </button>
      )}

      {/* Teacher Hand-raising Queue */}
      {handRaisedList.length > 0 && (
        <div
          style={{
            backgroundColor: '#1e293b',
            borderRadius: '12px',
            padding: '12px',
            border: '1px solid #f59e0b',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#fbbf24',
              fontWeight: 700,
              fontSize: '0.9rem',
              marginBottom: '10px',
            }}
          >
            <span>✋</span> صف نوبت صحبت دانش‌آموزان ({handRaisedList.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {handRaisedList.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#0f172a',
                  padding: '8px 12px',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                      boxShadow: '0 0 8px #f59e0b',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</span>
                </div>

                {isTeacher && (
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => onGrantMic && onGrantMic(p.id)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      اجازه صحبت
                    </button>
                    <button
                      type="button"
                      onClick={() => onLowerHand && onLowerHand(p.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#475569',
                        color: '#cbd5e1',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                      }}
                    >
                      رد نوبت
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teacher Profile Card */}
      {teacher && (
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '10px',
            padding: '12px',
            border: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              👨‍🏫
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{teacher.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>مدرس دوره (مدیر جلسه)</div>
            </div>
          </div>
          <span style={{ fontSize: '1.1rem' }}>{teacher.isMuted ? '🔇' : '🎙️'}</span>
        </div>
      )}

      {/* Students List with 70% Attendance Gauge */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
          <span>فهرست دانش‌آموزان ({students.length})</span>
          <span>درصد حضور (ملاک ≥۷۰٪)</span>
        </div>

        {students.map((student) => {
          const isMe = student.id === currentUserId;
          const isEligible = student.attendancePercentage >= 70;

          return (
            <div
              key={student.id}
              style={{
                backgroundColor: '#0f172a',
                borderRadius: '10px',
                padding: '10px 12px',
                border: isMe ? '1px solid #3b82f6' : '1px solid #1e293b',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#334155',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{student.name}</span>
                    {isMe && <span style={{ fontSize: '0.75rem', color: '#38bdf8', marginRight: '4px' }}>(شما)</span>}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isEligible ? '#4ade80' : '#f59e0b',
                    }}
                  >
                    {student.attendancePercentage}% {isEligible ? '✓ حاضر' : '⏱ در حال محاسبه'}
                  </span>
                  <span>{student.isMuted ? '🔇' : '🎙️'}</span>
                </div>
              </div>

              {/* Attendance Progress Bar */}
              <div
                style={{
                  height: '4px',
                  backgroundColor: '#1e293b',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, student.attendancePercentage)}%`,
                    backgroundColor: isEligible ? '#22c55e' : '#eab308',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>

              {/* Teacher controls per student */}
              {isTeacher && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => onGrantMic && onGrantMic(student.id)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#334155',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                    }}
                  >
                    فعال‌سازی میکروفون
                  </button>
                  <button
                    type="button"
                    onClick={() => onMuteStudent && onMuteStudent(student.id)}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                    }}
                  >
                    قطع صدا
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
