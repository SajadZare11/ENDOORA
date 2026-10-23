'use client';

import React, { useState } from 'react';

export interface AttendanceRow {
  student_id: string;
  student_name: string;
  student_email: string;
  attendance_percentage: number;
  total_connected_minutes: number;
  status: 'present' | 'absent' | 'tardy' | 'excused';
  status_display: string;
  teacher_override: boolean;
}

export interface AiRecapData {
  topics_covered: string[];
  key_points: string[];
  quiz_pitfalls: string[];
  suggested_homework: string;
  raw_markdown: string;
}

interface SessionRecapModalProps {
  isOpen: boolean;
  sessionId: string;
  isTeacher: boolean;
  attendanceList: AttendanceRow[];
  aiRecap: AiRecapData | null;
  pdfUrl?: string | null;
  onOverrideAttendance?: (studentId: string, newStatus: string, reason: string) => Promise<void>;
  onGenerateAiRecap?: () => Promise<void>;
  onClose: () => void;
  onExitClassroom: () => void;
}

export function SessionRecapModal({
  isOpen,
  sessionId,
  isTeacher,
  attendanceList,
  aiRecap,
  pdfUrl,
  onOverrideAttendance,
  onGenerateAiRecap,
  onClose,
  onExitClassroom,
}: SessionRecapModalProps) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'recap' | 'handout'>('attendance');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  if (!isOpen) return null;

  const handleAiClick = async () => {
    if (!onGenerateAiRecap) return;
    setIsGeneratingAi(true);
    try {
      await onGenerateAiRecap();
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(6px)',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '20px',
          width: '92%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          border: '1px solid #334155',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🏁</span> یکپارچگی و گزارش پایان جلسه آنلاین
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>شناسه جلسه: {sessionId}</span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '1.4rem',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px', padding: '12px 24px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
          <button
            onClick={() => setActiveTab('attendance')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'attendance' ? '#3b82f6' : 'transparent',
              color: activeTab === 'attendance' ? '#ffffff' : '#94a3b8',
            }}
          >
            📋 سجل حضور و غیاب خودکار (≥۷۰٪)
          </button>

          <button
            onClick={() => setActiveTab('recap')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'recap' ? '#3b82f6' : 'transparent',
              color: activeTab === 'recap' ? '#ffffff' : '#94a3b8',
            }}
          >
            ✨ خلاصه هوشمند تدریس (Gemini AI)
          </button>

          <button
            onClick={() => setActiveTab('handout')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              backgroundColor: activeTab === 'handout' ? '#3b82f6' : 'transparent',
              color: activeTab === 'handout' ? '#ffffff' : '#94a3b8',
            }}
          >
            📥 جزوه دست‌نویس تخته (PDF)
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div>
              <div
                style={{
                  backgroundColor: '#0f172a',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                  marginBottom: '16px',
                  lineHeight: 1.6,
                }}
              >
                💡 وضعیت حضور هر دانش‌آموز بر مبنای حضور حداقل <b>۷۰٪</b> کل زمان جلسه به صورت مستقیم در سامانه مدرسه ثبت شده است. دبیر قبل از بستن نهایی می‌تواند در صورت لزوم وضعیت را ویرایش نماید.
              </div>

              <div style={{ border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.9rem' }}>
                  <thead style={{ backgroundColor: '#0f172a', color: '#cbd5e1' }}>
                    <tr>
                      <th style={{ padding: '10px 14px' }}>نام دانش‌آموز</th>
                      <th style={{ padding: '10px 14px' }}>مدت اتصال</th>
                      <th style={{ padding: '10px 14px' }}>درصد حضور</th>
                      <th style={{ padding: '10px 14px' }}>وضعیت سیستمی</th>
                      {isTeacher && <th style={{ padding: '10px 14px' }}>تغییر دستی دبیر</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((row) => {
                      const isPresent = row.status === 'present';
                      return (
                        <tr key={row.student_id} style={{ borderTop: '1px solid #334155' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.student_name}</td>
                          <td style={{ padding: '12px 14px', color: '#94a3b8' }}>{row.total_connected_minutes} دقیقه</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ fontWeight: 700, color: isPresent ? '#4ade80' : '#f59e0b' }}>
                              {row.attendance_percentage}%
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                backgroundColor: isPresent ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: isPresent ? '#4ade80' : '#f87171',
                              }}
                            >
                              {row.status_display}
                            </span>
                          </td>
                          {isTeacher && (
                            <td style={{ padding: '12px 14px' }}>
                              <select
                                value={row.status}
                                onChange={(e) =>
                                  onOverrideAttendance &&
                                  onOverrideAttendance(row.student_id, e.target.value, 'ویرایش دستی توسط دبیر')
                                }
                                style={{
                                  backgroundColor: '#0f172a',
                                  color: '#ffffff',
                                  border: '1px solid #475569',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  outline: 'none',
                                }}
                              >
                                <option value="present">حاضر</option>
                                <option value="absent">غایب</option>
                                <option value="tardy">تاخیر / ناقص</option>
                                <option value="excused">مرخصی موجه</option>
                              </select>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AI RECAP */}
          {activeTab === 'recap' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  تحلیل و خلاصه جلسه با پردازش مباحث تخته، نتایج کوییزها و یادداشت‌های دبیر
                </span>
                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={handleAiClick}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#8b5cf6',
                    color: '#ffffff',
                    border: 'none',
                    cursor: isGeneratingAi ? 'wait' : 'pointer',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>✨</span> {isGeneratingAi ? 'در حال نگارش خلاصه...' : 'تولید / به‌روزرسانی خلاصه Gemini'}
                </button>
              </div>

              {aiRecap ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Topics Covered */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#38bdf8', fontSize: '1rem', fontWeight: 700 }}>
                      🎯 مباحث تدریس‌شده
                    </h4>
                    <ul style={{ margin: 0, paddingRight: '20px', color: '#e2e8f0', lineHeight: 1.8 }}>
                      {aiRecap.topics_covered.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Golden Formulas & Key Takeaways */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#facc15', fontSize: '1rem', fontWeight: 700 }}>
                      ⭐ نکات طلایی و فرمول‌های کلیدی
                    </h4>
                    <ul style={{ margin: 0, paddingRight: '20px', color: '#e2e8f0', lineHeight: 1.8 }}>
                      {aiRecap.key_points.map((p, idx) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Common Pitfalls from Quizzes */}
                  <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#f87171', fontSize: '1rem', fontWeight: 700 }}>
                      ⚠️ تحلیل خطاهای پرتکرار در کوییزهای جلسه
                    </h4>
                    <ul style={{ margin: 0, paddingRight: '20px', color: '#e2e8f0', lineHeight: 1.8 }}>
                      {aiRecap.quiz_pitfalls.map((pitfall, idx) => (
                        <li key={idx}>{pitfall}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggested Homework */}
                  {aiRecap.suggested_homework && (
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '12px', padding: '16px', border: '1px solid #334155' }}>
                      <h4 style={{ margin: '0 0 8px 0', color: '#4ade80', fontSize: '1rem', fontWeight: 700 }}>
                        📝 تکالیف و تمرین‌های پیشنهادی برای جلسه بعد
                      </h4>
                      <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.7 }}>{aiRecap.suggested_homework}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    backgroundColor: '#0f172a',
                    padding: '32px',
                    borderRadius: '12px',
                    textAlign: 'center',
                    border: '1px dashed #334155',
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>✨</span>
                  <div style={{ marginTop: '8px', fontWeight: 600 }}>خلاصه هوشمند تدریس هنوز تولید نشده است.</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                    برای تولید نکات کلیدی و تحلیل خطاهای کوییز، دکمه بالا را فشار دهید.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WHITEBOARD PDF HANDOUT */}
          {activeTab === 'handout' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.5rem',
                  marginBottom: '16px',
                }}
              >
                📄
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700 }}>جزوه دست‌نویس تخته‌سیاه (PDF)</h4>
              <p style={{ margin: '0 0 24px 0', color: '#94a3b8', textAlign: 'center', maxWidth: '440px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                تمام اسلایدها، دست‌نوشته‌ها، اشکال هندسی و فرمول‌های حل‌شده توسط دبیر به صورت مستقیم در یک فایل خروجی آماده دانلود قرار گرفته است.
              </p>

              {pdfUrl ? (
                <a
                  href={pdfUrl}
                  download={`jozveh-${sessionId}.pdf`}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
                  }}
                >
                  <span>📥</span> دانلود مستقیم جزوه جلسه (PDF)
                </a>
              ) : (
                <div style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: 600 }}>
                  ⏳ در حال آماده‌سازی و بهینه‌سازی فایل جزوه تخته...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #334155',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            سامانه کلاس آنلاین اندورا - سازگار با شبکه ملی اطلاعات
          </span>
          <button
            type="button"
            onClick={onExitClassroom}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            خروج و بازگشت به داشبورد
          </button>
        </div>
      </div>
    </div>
  );
}
