"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  getLeitnerDeck,
  deleteLeitnerCard,
  updateLeitnerCard,
  resetCardProgress,
  isCardDue,
  LEITNER_BOX_META,
  LeitnerCard,
  LeitnerBoxLevel,
} from "../../../lib/leitner-storage";
import styles from "./leitner.module.css";

const CATEGORY_MAP: Record<string, string> = {
  all: "همه دسته‌ها",
  grammar: "دستور زبان (Grammar)",
  vocabulary: "واژگان (Vocabulary)",
  pronunciation: "تلفظ و استرس (Pronunciation)",
  l1_persian: "تداخل فارسی (L1 Transfer)",
  collocation: "همایندها (Collocations)",
};

export const LeitnerCardsTable: React.FC = () => {
  const [deck, setDeck] = useState<LeitnerCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBox, setSelectedBox] = useState<number | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Editing state
  const [editingCard, setEditingCard] = useState<LeitnerCard | null>(null);
  const [editMistake, setEditMistake] = useState("");
  const [editCorrected, setEditCorrected] = useState("");
  const [editExplanation, setEditExplanation] = useState("");
  const [editCategory, setEditCategory] = useState("grammar");
  const [editBoxLevel, setEditBoxLevel] = useState<LeitnerBoxLevel>(1);

  // Deletion confirmation
  const [deletingCardId, setDeletingCardId] = useState<string | null>(null);

  const refreshCards = () => {
    setDeck(getLeitnerDeck());
  };

  useEffect(() => {
    refreshCards();
    const handleUpdate = () => refreshCards();
    window.addEventListener("endoora:leitner-updated", handleUpdate);
    return () => window.removeEventListener("endoora:leitner-updated", handleUpdate);
  }, []);

  // Filtered cards
  const filteredCards = useMemo(() => {
    return deck.filter((card) => {
      // Box filter
      if (selectedBox !== "all" && card.boxLevel !== selectedBox) {
        return false;
      }
      // Category filter
      if (selectedCategory !== "all" && card.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchMistake = card.originalMistake.toLowerCase().includes(query);
        const matchCorrected = card.correctedText.toLowerCase().includes(query);
        const matchExp = card.explanationFa.toLowerCase().includes(query);
        const matchSource = card.sourceTitle?.toLowerCase().includes(query);
        return matchMistake || matchCorrected || matchExp || matchSource;
      }
      return true;
    });
  }, [deck, selectedBox, selectedCategory, searchQuery]);

  const handleOpenEdit = (card: LeitnerCard) => {
    setEditingCard(card);
    setEditMistake(card.originalMistake);
    setEditCorrected(card.correctedText);
    setEditExplanation(card.explanationFa);
    setEditCategory(card.category);
    setEditBoxLevel(card.boxLevel);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard || !editMistake.trim() || !editCorrected.trim()) return;

    updateLeitnerCard(editingCard.id, {
      originalMistake: editMistake.trim(),
      correctedText: editCorrected.trim(),
      explanationFa: editExplanation.trim(),
      category: editCategory,
      categoryLabelFa: CATEGORY_MAP[editCategory] || "سفارشی",
      boxLevel: editBoxLevel,
    });

    setEditingCard(null);
    refreshCards();
  };

  const handleDelete = (cardId: string) => {
    deleteLeitnerCard(cardId);
    setDeletingCardId(null);
    refreshCards();
  };

  const handleResetCard = (cardId: string) => {
    resetCardProgress(cardId);
    refreshCards();
  };

  // Box count badges
  const boxCounts = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    deck.forEach((c) => {
      if (counts[c.boxLevel] !== undefined) {
        counts[c.boxLevel]++;
      }
    });
    return counts;
  }, [deck]);

  return (
    <section
      className={styles.shelfContainer}
      aria-label="بانک و مدیریت کارت‌های جعبه لایتنر"
      style={{ marginBlockStart: "2rem" }}
    >
      {/* Header */}
      <div className={styles.shelfHeader}>
        <div className={styles.shelfTitleGroup}>
          <span className={styles.shelfIcon} role="img" aria-label="مدیریت کارت‌ها">
            📋
          </span>
          <div>
            <h2 className={styles.shelfTitle}>بانک و مدیریت کارت‌های لایتنر</h2>
            <p className={styles.shelfSubtitle}>
              جستجو، بررسی جزئیات، ویرایش یا حذف خطاهای ثبت‌شده در جعبه ۵ خانه‌ای ({deck.length} کارت فعال)
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBlockEnd: "1.5rem",
          background: "var(--color-canvas, #f8fafc)",
          padding: "1rem",
          borderRadius: "12px",
          border: "1px solid var(--color-border, #e2e8f0)",
        }}
      >
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
          {/* Search Input */}
          <div style={{ flex: "1 1 240px", position: "relative" }}>
            <input
              type="text"
              className={styles.formInput}
              placeholder="جستجو در متن خطا، شکل صحیح یا توضیح..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingInlineStart: "2.25rem" }}
            />
            <span
              style={{
                position: "absolute",
                insetInlineStart: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-muted, #94a3b8)",
                pointerEvents: "none",
              }}
              aria-hidden="true"
            >
              🔍
            </span>
          </div>

          {/* Category Dropdown */}
          <div style={{ minWidth: "180px" }}>
            <select
              className={styles.formSelect}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="فیلتر بر اساس دسته‌بندی"
            >
              <option value="all">همه دسته‌بندی‌ها</option>
              <option value="grammar">دستور زبان (Grammar)</option>
              <option value="vocabulary">واژگان (Vocabulary)</option>
              <option value="pronunciation">تلفظ و استرس (Pronunciation)</option>
              <option value="l1_persian">تداخل فارسی (L1 Transfer)</option>
              <option value="collocation">همایندها (Collocations)</option>
            </select>
          </div>
        </div>

        {/* Box Filter Pills */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-muted, #64748b)" }}>
            فیلتر بر اساس جعبه:
          </span>
          <button
            type="button"
            onClick={() => setSelectedBox("all")}
            style={{
              padding: "0.35rem 0.75rem",
              borderRadius: "20px",
              border: selectedBox === "all" ? "2px solid #2563eb" : "1px solid var(--color-border, #cbd5e1)",
              background: selectedBox === "all" ? "#2563eb" : "var(--color-surface, #ffffff)",
              color: selectedBox === "all" ? "#ffffff" : "var(--color-text-primary, #1e293b)",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            همه ({deck.length})
          </button>

          {([1, 2, 3, 4, 5] as LeitnerBoxLevel[]).map((level) => {
            const meta = LEITNER_BOX_META[level];
            const isSelected = selectedBox === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedBox(level)}
                style={{
                  padding: "0.35rem 0.75rem",
                  borderRadius: "20px",
                  border: isSelected ? `2px solid ${meta.color}` : "1px solid var(--color-border, #cbd5e1)",
                  background: isSelected ? meta.color : "var(--color-surface, #ffffff)",
                  color: isSelected ? "#ffffff" : "var(--color-text-primary, #1e293b)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                }}
              >
                <span>جعبه {level}</span>
                <span
                  style={{
                    background: isSelected ? "rgba(255,255,255,0.25)" : "var(--color-canvas, #f1f5f9)",
                    padding: "0.1rem 0.4rem",
                    borderRadius: "10px",
                    fontSize: "0.75rem",
                  }}
                >
                  {boxCounts[level]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards List / Table */}
      {filteredCards.length === 0 ? (
        <div
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
            background: "var(--color-canvas, #f8fafc)",
            borderRadius: "12px",
            border: "1px dashed var(--color-border, #cbd5e1)",
          }}
        >
          <span style={{ fontSize: "2.5rem", display: "block", marginBlockEnd: "0.5rem" }} aria-hidden="true">
            🔍
          </span>
          <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--color-text-primary, #1e293b)", margin: 0 }}>
            هیچ کارتی با فیلترهای انتخابی مطابقت ندارد.
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted, #64748b)", marginBlockStart: "0.25rem" }}>
            می‌توانید عبارت جستجو را پاک کنید یا فیلتر جعبه‌ها را روی «همه» بگذارید.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredCards.map((card) => {
            const boxMeta = LEITNER_BOX_META[card.boxLevel];
            const due = isCardDue(card);

            return (
              <div
                key={card.id}
                style={{
                  background: "var(--color-surface, #ffffff)",
                  border: `1px solid var(--color-border, #e2e8f0)`,
                  borderInlineStart: `5px solid ${boxMeta.color}`,
                  borderRadius: "12px",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.85rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "box-shadow 0.2s ease",
                }}
              >
                {/* Top Row: Meta Badges & Actions */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Box badge */}
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "8px",
                        background: `${boxMeta.color}15`,
                        color: boxMeta.color,
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        border: `1px solid ${boxMeta.color}40`,
                      }}
                    >
                      {boxMeta.labelFa}
                    </span>

                    {/* Category badge */}
                    <span
                      style={{
                        padding: "0.2rem 0.6rem",
                        borderRadius: "8px",
                        background: "rgba(100, 116, 139, 0.1)",
                        color: "var(--color-text-muted, #475569)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {card.categoryLabelFa || CATEGORY_MAP[card.category] || card.category}
                    </span>

                    {/* Due badge */}
                    {due && (
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "8px",
                          background: "#ef444418",
                          color: "#dc2626",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          border: "1px solid #ef444440",
                        }}
                      >
                        ⚡ موعد مرور امروز
                      </span>
                    )}

                    {card.isMastered && (
                      <span
                        style={{
                          padding: "0.2rem 0.6rem",
                          borderRadius: "8px",
                          background: "#10b98118",
                          color: "#059669",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          border: "1px solid #10b98140",
                        }}
                      >
                        🌟 تثبیت‌شده و مسلط
                      </span>
                    )}

                    {card.sourceTitle && (
                      <span style={{ fontSize: "0.78rem", color: "var(--color-text-muted, #94a3b8)" }}>
                        منبع: {card.sourceTitle}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                    {card.boxLevel > 1 && (
                      <button
                        type="button"
                        onClick={() => handleResetCard(card.id)}
                        title="انتقال به جعبه ۱ برای یادگیری مجدد"
                        style={{
                          padding: "0.35rem 0.65rem",
                          borderRadius: "8px",
                          background: "rgba(249, 115, 22, 0.1)",
                          color: "#c2410c",
                          border: "1px solid rgba(249, 115, 22, 0.25)",
                          fontSize: "0.78rem",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        🔄 شروع مجدد (جعبه ۱)
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(card)}
                      title="ویرایش کارت"
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "8px",
                        background: "rgba(37, 99, 235, 0.1)",
                        color: "#2563eb",
                        border: "1px solid rgba(37, 99, 235, 0.25)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      ✏️ ویرایش
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingCardId(card.id)}
                      title="حذف کارت"
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: "8px",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#dc2626",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>

                {/* Content: Mistake & Corrected Sentence */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "0.75rem",
                  }}
                >
                  {/* Wrong Text */}
                  <div
                    style={{
                      background: "rgba(239, 68, 68, 0.05)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: "#dc2626",
                        display: "block",
                        marginBlockEnd: "0.25rem",
                      }}
                    >
                      ❌ اشتباه یادگیرنده:
                    </span>
                    <p
                      dir="ltr"
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#991b1b",
                        lineHeight: 1.5,
                      }}
                    >
                      {card.originalMistake}
                    </p>
                  </div>

                  {/* Correct Text */}
                  <div
                    style={{
                      background: "rgba(16, 185, 129, 0.05)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      borderRadius: "10px",
                      padding: "0.75rem 1rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 800,
                        color: "#059669",
                        display: "block",
                        marginBlockEnd: "0.25rem",
                      }}
                    >
                      ✅ نگارش صحیح و استاندارد:
                    </span>
                    <p
                      dir="ltr"
                      style={{
                        margin: 0,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#065f46",
                        lineHeight: 1.5,
                      }}
                    >
                      {card.correctedText}
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                {card.explanationFa && (
                  <div
                    style={{
                      background: "var(--color-canvas, #f8fafc)",
                      borderRadius: "8px",
                      padding: "0.6rem 0.85rem",
                      border: "1px solid var(--color-border, #e2e8f0)",
                      fontSize: "0.85rem",
                      color: "var(--color-text-primary, #334155)",
                      lineHeight: 1.6,
                    }}
                  >
                    <strong style={{ color: "#2563eb" }}>💡 ریشه و تحلیل خطا: </strong>
                    {card.explanationFa}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingCardId && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent} style={{ maxWidth: "420px" }}>
            <h3 className={styles.modalTitle}>حذف کارت از جعبه لایتنر</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-muted, #64748b)", marginBlock: "0.75rem" }}>
              آیا از حذف این کارت اطمینان دارید؟ با حذف کارت، سابقه مرور و موقعیت آن در جعبه لایتنر پاک خواهد شد.
            </p>
            <div className={styles.modalFooter}>
              <button
                type="button"
                className={styles.addMistakeButton}
                style={{ background: "#cbd5e130", color: "var(--color-text-primary, #475569)", borderColor: "#cbd5e1" }}
                onClick={() => setDeletingCardId(null)}
              >
                انصراف
              </button>
              <button
                type="button"
                className={styles.addMistakeButton}
                style={{ background: "#ef4444", color: "#ffffff", borderColor: "#dc2626" }}
                onClick={() => handleDelete(deletingCardId)}
              >
                حذف قطعی کارت
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingCard && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>ویرایش کارت لایتنر</h3>
            <form onSubmit={handleSaveEdit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>متن اشتباه (جمله دارای خطا):</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  value={editMistake}
                  onChange={(e) => setEditMistake(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>شکل صحیح و استاندارد:</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  value={editCorrected}
                  onChange={(e) => setEditCorrected(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>توضیح فارسی و ریشه خطای زبانی:</label>
                <textarea
                  rows={3}
                  className={styles.formTextarea}
                  value={editExplanation}
                  onChange={(e) => setEditExplanation(e.target.value)}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>دسته‌بندی:</label>
                  <select
                    className={styles.formSelect}
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="grammar">دستور زبان (Grammar)</option>
                    <option value="vocabulary">واژگان (Vocabulary)</option>
                    <option value="pronunciation">تلفظ و استرس (Pronunciation)</option>
                    <option value="l1_persian">تداخل فارسی (L1 Transfer)</option>
                    <option value="collocation">همایندها (Collocations)</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>شماره جعبه لایتنر:</label>
                  <select
                    className={styles.formSelect}
                    value={editBoxLevel}
                    onChange={(e) => setEditBoxLevel(Number(e.target.value) as LeitnerBoxLevel)}
                  >
                    <option value={1}>خانه ۱ (تازه‌واردها - مرور روزانه)</option>
                    <option value={2}>خانه ۲ (در حال یادگیری - هر ۳ روز)</option>
                    <option value={3}>خانه ۳ (تثبیت اولیه - هر هفته)</option>
                    <option value={4}>خانه ۴ (حافظه پایدار - هر ۲ هفته)</option>
                    <option value={5}>خانه ۵ (فتح‌شده - تسلط کامل)</option>
                  </select>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.addMistakeButton}
                  style={{ background: "#cbd5e130", color: "var(--color-text-primary, #475569)", borderColor: "#cbd5e1" }}
                  onClick={() => setEditingCard(null)}
                >
                  انصراف
                </button>
                <button type="submit" className={styles.addMistakeButton} style={{ background: "#2563eb", color: "#ffffff", borderColor: "#1d4ed8" }}>
                  ذخیره تغییرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
