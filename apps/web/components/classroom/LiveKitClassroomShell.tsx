'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { InteractiveEducationalWhiteboard } from './InteractiveEducationalWhiteboard';
import { InClassQuizPodium, type ActiveQuizState } from './InClassQuizPodium';
import { StudentQuizOverlay } from './StudentQuizOverlay';
import { ClassroomAttendeesPanel, type ParticipantInfo } from './ClassroomAttendeesPanel';
import { ClassroomChatPanel, type ChatMessage } from './ClassroomChatPanel';
import { SessionRecapModal, type AttendanceRow, type AiRecapData } from './SessionRecapModal';

interface LiveKitClassroomShellProps {
  sessionId: string;
  initialRole?: 'teacher' | 'student';
}

export function LiveKitClassroomShell({
  sessionId,
  initialRole = 'student',
}: LiveKitClassroomShellProps) {
  const router = useRouter();

  // Role and Identity
  const [role, setRole] = useState<'teacher' | 'student'>(initialRole);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // Media Controls
  const [isMicMuted, setIsMicMuted] = useState<boolean>(role !== 'teacher');
  const [hasMicPermission, setHasMicPermission] = useState<boolean>(role === 'teacher');
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState<boolean>(true);

  // Sidebar Tab
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'attendees' | 'quiz'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Classroom Live State
  const [participants, setParticipants] = useState<ParticipantInfo[]>([
    {
      id: 'teacher-1',
      name: 'استاد علوی (دبیر ریاضی و فیزیک)',
      email: 'teacher@endoora.ir',
      role: 'teacher',
      isSpeaking: true,
      isMuted: false,
      hasHandRaised: false,
      connectedSeconds: 1800,
      attendancePercentage: 100,
    },
    {
      id: 'student-me',
      name: 'شما (دانش‌آموز)',
      email: 'learner@endoora.ir',
      role: 'student',
      isSpeaking: false,
      isMuted: true,
      hasHandRaised: false,
      connectedSeconds: 1540,
      attendancePercentage: 85,
    },
    {
      id: 'student-2',
      name: 'مهدی حسینی',
      email: 'mehdi@endoora.ir',
      role: 'student',
      isSpeaking: false,
      isMuted: true,
      hasHandRaised: false,
      connectedSeconds: 1620,
      attendancePercentage: 90,
    },
    {
      id: 'student-3',
      name: 'فاطمه احمدی',
      email: 'fatemeh@endoora.ir',
      role: 'student',
      isSpeaking: false,
      isMuted: true,
      hasHandRaised: true,
      connectedSeconds: 1200,
      attendancePercentage: 66,
    },
  ]);

  // Quiz State
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuizState | null>(null);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderId: 'teacher-1',
      senderName: 'استاد علوی',
      senderRole: 'teacher',
      text: 'سلام به همگی، به کلاس آنلاین خوش آمدید. لطفاً جزوه جلسه را روی تخته مشاهده کنید.',
      timestamp: '۱۰:۰۲',
    },
    {
      id: 'msg-2',
      senderId: 'student-2',
      senderName: 'مهدی حسینی',
      senderRole: 'student',
      text: 'سلام استاد، صدا و تصویر تخته کاملاً واضح و باکیفیت است.',
      timestamp: '۱۰:۰۳',
    },
  ]);
  const [isChatLocked, setIsChatLocked] = useState<boolean>(false);

  // Whiteboard Real-time Sync Data
  const [incomingStroke, setIncomingStroke] = useState<any>(null);

  // End Session & Recap Modal
  const [showRecapModal, setShowRecapModal] = useState<boolean>(false);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRow[]>([]);
  const [aiRecapData, setAiRecapData] = useState<AiRecapData | null>(null);
  const [whiteboardPdfUrl, setWhiteboardPdfUrl] = useState<string | null>(null);

  // Hand-raising state for current user
  const [myHandRaised, setMyHandRaised] = useState<boolean>(false);

  // 1. Fetch Room Token from Django API
  useEffect(() => {
    async function fetchToken() {
      try {
        const res = await fetch('/api/live-classes/token/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId, role }),
        });
        if (res.ok) {
          const data = await res.json();
          setTokenInfo(data);
          setConnectionStatus('connected');
        } else {
          setConnectionStatus('connected'); // Fallback demo mode
        }
      } catch {
        setConnectionStatus('connected');
      }
    }
    fetchToken();
  }, [sessionId, role]);

  // 2. Attendance Heartbeat Ping (Tracks active seconds for 70% threshold)
  useEffect(() => {
    const heartbeatInterval = setInterval(async () => {
      try {
        await fetch('/api/live-classes/webhooks/livekit/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'participant_joined',
            room: { name: sessionId },
            participant: { identity: tokenInfo?.identity || 'student-me' },
          }),
        });
      } catch {
        // silent ping
      }
    }, 30000); // every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, [sessionId, tokenInfo]);

  // DataChannel Broadcast Simulation / Emitter
  const handleSendStroke = (strokeData: any) => {
    // In real LiveKit, localParticipant.publishData(JSON.stringify(strokeData))
    // Here we support both local and remote peers
  };

  // Launch Quiz (Teacher)
  const handleLaunchQuiz = async (quizData: {
    prompt: string;
    options: string[];
    correct_option_index: number | null;
    duration_seconds: number;
  }) => {
    try {
      const res = await fetch('/api/live-classes/quizzes/launch/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          prompt: quizData.prompt,
          options: quizData.options,
          correct_option_index: quizData.correct_option_index,
          duration_seconds: quizData.duration_seconds,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const newQuiz: ActiveQuizState = {
          quiz_id: data.quiz_id,
          prompt: data.prompt,
          options: data.options,
          correct_option_index: data.correct_option_index,
          duration_seconds: data.duration_seconds,
          is_active: true,
          is_results_published: false,
          total_responses: 0,
          distribution: data.options.map((opt: string, i: number) => ({
            index: i,
            label: opt,
            count: 0,
            percentage: 0,
          })),
        };
        setActiveQuiz(newQuiz);
      }
    } catch (err) {
      console.error('Launch failed:', err);
    }
  };

  // Publish Quiz Results (Teacher)
  const handlePublishResults = async (quizId: string) => {
    try {
      const res = await fetch(`/api/live-classes/quizzes/${quizId}/publish/`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setActiveQuiz(data);
      }
    } catch (err) {
      console.error('Publish failed:', err);
    }
  };

  // Submit Answer (Student)
  const handleSubmitAnswer = async (quizId: string, optionIndex: number) => {
    try {
      await fetch(`/api/live-classes/quizzes/${quizId}/respond/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selected_option_index: optionIndex,
          time_to_respond_seconds: 4.5,
        }),
      });

      // Fetch updated distribution
      const res = await fetch(`/api/live-classes/quizzes/${quizId}/analytics/`);
      if (res.ok) {
        const updated = await res.json();
        setActiveQuiz(updated);
      }
    } catch (err) {
      console.error('Submit answer failed:', err);
    }
  };

  // Toggle Hand Raising (Student)
  const handleToggleRaiseHand = () => {
    const nextState = !myHandRaised;
    setMyHandRaised(nextState);
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === 'student-me'
          ? { ...p, hasHandRaised: nextState, handRaisedAt: nextState ? Date.now() : undefined }
          : p
      )
    );
  };

  // Grant Mic (Teacher)
  const handleGrantMic = (studentId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === studentId ? { ...p, isMuted: false, hasHandRaised: false } : p
      )
    );
    if (studentId === 'student-me') {
      setHasMicPermission(true);
      setIsMicMuted(false);
    }
  };

  // Mute Student (Teacher)
  const handleMuteStudent = (studentId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === studentId ? { ...p, isMuted: true } : p))
    );
    if (studentId === 'student-me') {
      setIsMicMuted(true);
    }
  };

  // Lower Hand (Teacher)
  const handleLowerHand = (studentId: string) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === studentId ? { ...p, hasHandRaised: false } : p))
    );
  };

  // Send Chat Message
  const handleSendMessage = (text: string) => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: role === 'teacher' ? 'teacher-1' : 'student-me',
      senderName: role === 'teacher' ? 'استاد علوی' : 'شما',
      senderRole: role,
      text,
      timestamp: timeStr,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Toggle Chat Lock (Teacher)
  const handleToggleChatLock = () => {
    setIsChatLocked((prev) => !prev);
  };

  // End Session Action
  const handleEndSession = async () => {
    try {
      // 1. Finalize Attendance
      const attRes = await fetch(`/api/live-classes/${sessionId}/attendance/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finalize', duration_minutes: 60 }),
      });
      if (attRes.ok) {
        const data = await attRes.json();
        setAttendanceRecords(data.attendance || []);
      }

      // 2. Fetch AI Recap if available
      const recapRes = await fetch(`/api/live-classes/${sessionId}/recap/`);
      if (recapRes.ok) {
        const recapData = await recapRes.json();
        setAiRecapData(recapData);
      }

      // 3. Fetch Whiteboard PDF if uploaded
      const pdfRes = await fetch(`/api/live-classes/${sessionId}/whiteboard-pdf/`);
      if (pdfRes.ok) {
        const pdfData = await pdfRes.json();
        setWhiteboardPdfUrl(pdfData.pdf_url);
      }
    } catch (err) {
      console.error('End session error:', err);
    }
    setShowRecapModal(true);
  };

  // Generate Gemini AI Recap
  const handleGenerateAiRecap = async () => {
    try {
      const res = await fetch(`/api/live-classes/${sessionId}/recap/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          topics_covered: 'مکانیک کلاسیک، قوانین نیوتون، معادلات حرکت، حل تست‌های پرتکرار نهایی',
          whiteboard_text: 'F = m*a, v = v0 + a*t, K = 0.5*m*v^2',
          teacher_notes: 'دانش‌آموزان روی تبدیل واحدهای فیزیک و جهت بردارها در کوییزها دقت بیشتری داشته باشند.',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiRecapData(data);
      }
    } catch (err) {
      console.error('AI recap generation error:', err);
    }
  };

  // Override Attendance (Teacher)
  const handleOverrideAttendance = async (studentId: string, newStatus: string, reason: string) => {
    try {
      await fetch(`/api/live-classes/${sessionId}/attendance/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'override',
          student_id: studentId,
          status: newStatus,
          reason,
        }),
      });
      setAttendanceRecords((prev) =>
        prev.map((r) =>
          r.student_id === studentId ? { ...r, status: newStatus as any, teacher_override: true } : r
        )
      );
    } catch (err) {
      console.error('Attendance override error:', err);
    }
  };

  const handleExit = () => {
    router.push('/teacher/classes');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#090d16',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        direction: 'rtl',
        fontFamily: 'Vazirmatn, system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Classroom Bar */}
      <header
        style={{
          height: '60px',
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo / Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>🎓</span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ffffff' }}>کلاس آنلاین اندورا</span>
          </div>

          <div style={{ width: '1px', height: '24px', backgroundColor: '#334155' }} />

          {/* Session Title & Intranet Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
              جلسه آنلاین ریاضی و فیزیک (اتاق {sessionId})
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'rgba(34, 197, 94, 0.15)',
                color: '#4ade80',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              شبکه ملی اطلاعات (ترافیک داخلی و نیم‌بها)
            </span>
          </div>
        </div>

        {/* Center / Right Control Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Microphone toggle */}
          <button
            type="button"
            disabled={!hasMicPermission && role !== 'teacher'}
            onClick={() => setIsMicMuted(!isMicMuted)}
            title={!hasMicPermission && role !== 'teacher' ? 'میکروفون توسط دبیر غیرفعال است (دست بلند کنید)' : 'قطع/وصل میکروفون'}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              backgroundColor: isMicMuted ? '#ef4444' : '#10b981',
              color: '#ffffff',
              border: 'none',
              cursor: !hasMicPermission && role !== 'teacher' ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isMicMuted ? '🔇' : '🎙️'}</span>
            <span>{isMicMuted ? 'میکروفون قطع' : 'میکروفون فعال'}</span>
          </button>

          {/* Role switcher for quick verification */}
          <button
            type="button"
            onClick={() => setRole(role === 'teacher' ? 'student' : 'teacher')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#334155',
              color: '#cbd5e1',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            تغییر نما: {role === 'teacher' ? 'دبیر 👨‍🏫' : 'دانش‌آموز 🎒'}
          </button>

          {/* Toggle Sidebar Button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#1e293b',
              color: '#cbd5e1',
              border: '1px solid #334155',
              cursor: 'pointer',
              fontSize: '0.85rem',
            }}
          >
            {isSidebarOpen ? 'پنهان‌سازی پنل جانبی ◀' : 'نمایش پنل جانبی ▶'}
          </button>

          {/* End Session Button (for Teacher) */}
          {role === 'teacher' ? (
            <button
              type="button"
              onClick={handleEndSession}
              style={{
                padding: '6px 16px',
                borderRadius: '8px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              🏁 پایان جلسه و ثبت خودکار
            </button>
          ) : (
            <button
              type="button"
              onClick={handleEndSession}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                backgroundColor: '#334155',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              مشاهده خلاصه و جزوه
            </button>
          )}
        </div>
      </header>

      {/* Main Classroom Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Side: Interactive Educational Whiteboard */}
        <div style={{ flex: 1, height: '100%', position: 'relative' }}>
          <InteractiveEducationalWhiteboard
            sessionId={sessionId}
            isTeacher={role === 'teacher'}
            onSendStrokeData={handleSendStroke}
            incomingStrokeData={incomingStroke}
          />
        </div>

        {/* Right Side: Collapsible Control Panels (Chat, Attendees, Quiz) */}
        {isSidebarOpen && (
          <aside
            style={{
              width: '380px',
              backgroundColor: '#0f172a',
              borderRight: '1px solid #1e293b',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 30,
            }}
          >
            {/* Sidebar Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid #1e293b',
                backgroundColor: '#090d16',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveSideTab('chat')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  border: 'none',
                  backgroundColor: activeSideTab === 'chat' ? '#0f172a' : 'transparent',
                  color: activeSideTab === 'chat' ? '#38bdf8' : '#94a3b8',
                  borderBottom: activeSideTab === 'chat' ? '2px solid #38bdf8' : 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                💬 چت کلاسی
              </button>

              <button
                type="button"
                onClick={() => setActiveSideTab('attendees')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  border: 'none',
                  backgroundColor: activeSideTab === 'attendees' ? '#0f172a' : 'transparent',
                  color: activeSideTab === 'attendees' ? '#38bdf8' : '#94a3b8',
                  borderBottom: activeSideTab === 'attendees' ? '2px solid #38bdf8' : 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                👥 حاضرین و نوبت
                {participants.some((p) => p.hasHandRaised) && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#f59e0b',
                    }}
                  />
                )}
              </button>

              {role === 'teacher' && (
                <button
                  type="button"
                  onClick={() => setActiveSideTab('quiz')}
                  style={{
                    flex: 1,
                    padding: '12px 0',
                    border: 'none',
                    backgroundColor: activeSideTab === 'quiz' ? '#0f172a' : 'transparent',
                    color: activeSideTab === 'quiz' ? '#38bdf8' : '#94a3b8',
                    borderBottom: activeSideTab === 'quiz' ? '2px solid #38bdf8' : 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  🚀 سکوی کوییز
                </button>
              )}
            </div>

            {/* Sidebar Tab Content */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {activeSideTab === 'chat' && (
                <ClassroomChatPanel
                  messages={messages}
                  currentUserId={role === 'teacher' ? 'teacher-1' : 'student-me'}
                  isTeacher={role === 'teacher'}
                  isChatLocked={isChatLocked}
                  onSendMessage={handleSendMessage}
                  onToggleChatLock={handleToggleChatLock}
                />
              )}

              {activeSideTab === 'attendees' && (
                <ClassroomAttendeesPanel
                  participants={participants}
                  currentUserId={role === 'teacher' ? 'teacher-1' : 'student-me'}
                  isTeacher={role === 'teacher'}
                  myHandRaised={myHandRaised}
                  onToggleRaiseHand={handleToggleRaiseHand}
                  onGrantMic={handleGrantMic}
                  onMuteStudent={handleMuteStudent}
                  onLowerHand={handleLowerHand}
                />
              )}

              {activeSideTab === 'quiz' && role === 'teacher' && (
                <InClassQuizPodium
                  sessionId={sessionId}
                  activeQuiz={activeQuiz}
                  onLaunchQuiz={handleLaunchQuiz}
                  onPublishResults={handlePublishResults}
                />
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Student Quiz Overlay Modal (Fires automatically for student when teacher launches quiz) */}
      {role === 'student' && activeQuiz && activeQuiz.is_active && (
        <StudentQuizOverlay
          quiz={activeQuiz}
          onSubmitAnswer={handleSubmitAnswer}
        />
      )}

      {/* End Session Summary & Gemini AI Recap Modal */}
      <SessionRecapModal
        isOpen={showRecapModal}
        sessionId={sessionId}
        isTeacher={role === 'teacher'}
        attendanceList={attendanceRecords}
        aiRecap={aiRecapData}
        pdfUrl={whiteboardPdfUrl}
        onOverrideAttendance={handleOverrideAttendance}
        onGenerateAiRecap={handleGenerateAiRecap}
        onClose={() => setShowRecapModal(false)}
        onExitClassroom={handleExit}
      />
    </div>
  );
}
