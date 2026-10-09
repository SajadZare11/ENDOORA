"use client";

import React, { useState, useEffect } from "react";
import type { HighSchoolConversationSection, ConversationLine, HighSchoolVocabItem } from "@endoora/contracts";
import { playEnglishSpeech } from "@/lib/speech";
import { InteractiveVocabCard } from "./InteractiveVocabCard";
import styles from "./highschool-player.module.css";

interface ConversationAssemblerProps {
  conversation: HighSchoolConversationSection;
  onComplete?: () => void;
  onMistake?: (item: HighSchoolVocabItem) => void;
}

export const ConversationAssembler: React.FC<ConversationAssemblerProps> = ({
  conversation,
  onComplete,
  onMistake
}) => {
  const [activeTab, setActiveTab] = useState<"vocab" | "puzzle">("vocab");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [assembledLines, setAssembledLines] = useState<ConversationLine[]>([]);
  const [shakingCardId, setShakingCardId] = useState<string | null>(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const totalLines = conversation.dialogueLines.length;
  const isFinished = assembledLines.length === totalLines;

  // Candidate lines: pick the correct current line + unplaced lines
  const targetLine = conversation.dialogueLines[currentLineIndex];

  // Play target line audio when currentLineIndex advances in puzzle mode
  useEffect(() => {
    if (activeTab === "puzzle" && targetLine && !isFinished) {
      const timer = setTimeout(() => {
        playEnglishSpeech(targetLine.enText);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeTab, currentLineIndex, isFinished]);

  // When puzzle completes
  useEffect(() => {
    if (isFinished) {
      onComplete?.();
    }
  }, [isFinished, onComplete]);

  const handleCandidateClick = (line: ConversationLine) => {
    if (isFinished) return;

    if (line.id === targetLine.id) {
      setAssembledLines((prev) => [...prev, line]);
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      setShakingCardId(line.id);
      setTimeout(() => setShakingCardId(null), 400);
    }
  };

  const handlePlayFullConversation = async () => {
    if (isPlayingFull) return;
    setIsPlayingFull(true);
    for (const line of conversation.dialogueLines) {
      playEnglishSpeech(line.enText);
      await new Promise((resolve) => setTimeout(resolve, 3800));
    }
    setIsPlayingFull(false);
  };

  // Get unplaced lines for candidates
  const remainingLines = conversation.dialogueLines.filter(
    (l) => !assembledLines.some((al) => al.id === l.id)
  );

  return (
    <div>
      {/* Sub-navigation between Blue Box Words and Dialogue Puzzle */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "vocab" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("vocab")}
        >
          📘 کلمات کادر آبی ({conversation.vocabulary.length} واژه)
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${activeTab === "puzzle" ? styles.tabButtonActive : ""}`}
          onClick={() => setActiveTab("puzzle")}
        >
          🧩 پازل شنیداری مکالمه {isFinished ? "✓ (تکمیل شده)" : `(${assembledLines.length}/${totalLines})`}
        </button>
      </div>

      {activeTab === "vocab" ? (
        <div>
          <div style={{ marginBottom: "1.25rem", padding: "0.85rem 1.15rem", background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", borderRadius: "12px", border: "1px solid #bfdbfe", color: "#1e40af", fontSize: "0.92rem", lineHeight: 1.6 }}>
            💡 <strong>آموزش کلمات کادر آبی مکالمه:</strong> ابتدا روی گزینه انگلیسی مرتبط با هر مفهوم کلیک کنید. با انتخاب درست، معنی، مثال و تلفظ فعال می‌شود. سپس به بخش «پازل شنیداری مکالمه» بروید.
          </div>
          <div className={styles.vocabGrid}>
            {conversation.vocabulary.map((item) => (
              <InteractiveVocabCard
                key={item.id}
                item={item}
                onMistake={onMistake}
              />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <button
              type="button"
              className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
              onClick={() => setActiveTab("puzzle")}
            >
              رفتن به پازل چیدمان مکالمه ←
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Situation Context Banner */}
          <div className={styles.situationCard}>
            <span style={{ fontSize: "1.2rem" }}>📍</span>
            <div>
              <strong>موقعیت مکالمه: </strong>
              <span>{conversation.situationFa}</span>
            </div>
          </div>

          <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-muted, #64748b)" }}>
              {isFinished ? "✅ مکالمه کامل شد" : `🎧 پیشرفت چیدمان: ${assembledLines.length} از ${totalLines} جمله`}
            </span>
            <button
              type="button"
              className={styles.tabButton}
              onClick={() => setShowTranslations((prev) => !prev)}
            >
              {showTranslations ? "👁️‍🗨️ مخفی‌سازی ترجمه فارسی" : "👁️ نمایش ترجمه فارسی خط‌به‌خط"}
            </button>
          </div>

          {/* Chat transcript window with macOS chrome */}
          <div style={{ border: "1px solid var(--color-border, #e2e8f0)", borderRadius: "18px", overflow: "hidden", marginBottom: "1rem" }}>
            <div className={styles.windowChrome}>
              <div className={styles.chromeDots}>
                <span className={styles.trafficRed} />
                <span className={styles.trafficYellow} />
                <span className={styles.trafficGreen} />
              </div>
              <div className={styles.chromeTitle}>
                <span>Dialogue Player</span>
                <span>•</span>
                <span>{conversation.title}</span>
              </div>
            </div>

            <div className={styles.chatContainer} style={{ borderTop: "none", borderRadius: "0 0 18px 18px", marginBlockEnd: 0 }}>
              {assembledLines.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎧</div>
                  <strong>در حال پخش اولین نوبت گفتگو...</strong>
                  <p style={{ margin: "0.35rem 0 0 0", fontSize: "0.88rem" }}>
                    به صدای گوینده گوش دهید و از بین کارت‌های زیر روی جمله صحیح کلیک کنید.
                  </p>
                </div>
              ) : (
                assembledLines.map((line) => (
                  <div key={line.id} className={styles.chatBubble}>
                    <span className={styles.avatar}>{line.speakerAvatar}</span>
                    <div className={styles.bubbleBody}>
                      <div className={styles.bubbleHeader}>
                        <span className={styles.speakerName}>{line.speaker}</span>
                        <button
                          type="button"
                          className={styles.audioSpeakerBtn}
                          style={{ fontSize: "0.72rem", padding: "0.15rem 0.4rem" }}
                          onClick={() => playEnglishSpeech(line.enText)}
                          title="پخش مجدد این نوبت گفتگو"
                        >
                          🔊
                        </button>
                      </div>
                      <div className={styles.dialogueTextEn}>{line.enText}</div>
                      {showTranslations && (
                        <div className={styles.dialogueTextFa}>{line.faText}</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Current line candidate options */}
          {!isFinished && targetLine ? (
            <div style={{ background: "var(--color-surface, #ffffff)", padding: "1.25rem", borderRadius: "16px", border: "1px solid var(--color-border, #e2e8f0)", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#2563eb", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span>🧩</span> نوبت جاری: جمله شماره {currentLineIndex + 1} از {totalLines}
                </span>
                <button
                  type="button"
                  className={styles.audioSpeakerBtn}
                  onClick={() => playEnglishSpeech(targetLine.enText)}
                >
                  🔊 پخش مجدد صوت این جمله
                </button>
              </div>

              <div className={styles.candidateCards}>
                {remainingLines.map((line, idx) => {
                  const isShaking = shakingCardId === line.id;
                  return (
                    <button
                      key={line.id}
                      type="button"
                      className={`${styles.candidateCard} ${isShaking ? styles.shake : ""}`}
                      onClick={() => handleCandidateClick(line)}
                    >
                      <span className={styles.optionLetterBadge}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span style={{ flex: 1 }}>{line.enText}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "1.75rem", background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", borderRadius: "16px", border: "1px solid #86efac", boxShadow: "0 6px 20px rgba(34, 197, 94, 0.15)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎉 عالی بود!</div>
              <h3 style={{ margin: "0 0 0.5rem 0", color: "#166534", fontWeight: 800, fontSize: "1.25rem" }}>
                کل مکالمه را با موفقیت مرتب کردید.
              </h3>
              <p style={{ margin: "0 0 1.25rem 0", color: "#15803d", fontSize: "0.95rem" }}>
                اکنون می‌توانید کل مکالمه را با صدای طبیعی و روان پشت سر هم بشنوید و مرور کنید.
              </p>
              <button
                type="button"
                className={`${styles.navActionBtn} ${styles.navActionBtnPrimary}`}
                onClick={handlePlayFullConversation}
                disabled={isPlayingFull}
              >
                {isPlayingFull ? "در حال پخش کل مکالمه..." : "🔊 پخش یکپارچه کل مکالمه"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
