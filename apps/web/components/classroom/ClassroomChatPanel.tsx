'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'teacher' | 'student';
  text: string;
  timestamp: string;
}

interface ClassroomChatPanelProps {
  messages: ChatMessage[];
  currentUserId: string;
  isTeacher: boolean;
  isChatLocked: boolean;
  onSendMessage: (text: string) => void;
  onToggleChatLock?: () => void;
}

export function ClassroomChatPanel({
  messages,
  currentUserId,
  isTeacher,
  isChatLocked,
  onSendMessage,
  onToggleChatLock,
}: ClassroomChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || (isChatLocked && !isTeacher)) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#f8fafc',
        direction: 'rtl',
      }}
    >
      {/* Chat Header & Lock Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          borderBottom: '1px solid #334155',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.95rem' }}>
          <span>💬</span> گفتگوی متنی کلاس
        </div>

        {isTeacher && onToggleChatLock && (
          <button
            type="button"
            onClick={onToggleChatLock}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: isChatLocked ? '#ef4444' : '#334155',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {isChatLocked ? '🔒 چت قفل است (باز کردن)' : '🔓 قفل موقت چت'}
          </button>
        )}
      </div>

      {isChatLocked && (
        <div
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.8rem',
            color: '#fca5a5',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          🔒 ارسال پیام توسط دبیر موقتاً غیرفعال شده است.
        </div>
      )}

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingLeft: '4px',
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          const isTeacherMsg = msg.senderRole === 'teacher';

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMe ? 'flex-start' : 'flex-end',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.75rem',
                  color: isTeacherMsg ? '#38bdf8' : '#94a3b8',
                  marginBottom: '2px',
                }}
              >
                <span>{msg.senderName}</span>
                {isTeacherMsg && <span>(مدرس)</span>}
                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{msg.timestamp}</span>
              </div>

              <div
                style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: isMe ? '12px 12px 12px 2px' : '12px 12px 2px 12px',
                  backgroundColor: isMe ? '#3b82f6' : isTeacherMsg ? '#1e293b' : '#0f172a',
                  border: isTeacherMsg ? '1px solid #38bdf8' : '1px solid #334155',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Form */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <input
          type="text"
          placeholder={isChatLocked && !isTeacher ? 'چت قفل است...' : 'پیام خود را بنویسید...'}
          disabled={isChatLocked && !isTeacher}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{
            flex: 1,
            backgroundColor: '#0f172a',
            border: '1px solid #475569',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#ffffff',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isChatLocked && !isTeacher}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            cursor: isChatLocked && !isTeacher ? 'not-allowed' : 'pointer',
            fontWeight: 700,
            fontSize: '0.85rem',
          }}
        >
          ارسال
        </button>
      </form>
    </div>
  );
}
