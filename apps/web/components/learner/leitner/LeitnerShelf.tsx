"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  getLeitnerDeck,
  calculateDeckStats,
  addCustomMistakeCard,
  LEITNER_BOX_META,
  LeitnerBoxLevel,
  LeitnerDeckStats,
  LeitnerCard,
} from "../../../lib/leitner-storage";
import styles from "./leitner.module.css";

interface LeitnerShelfProps {
  onDeckChange?: (stats: LeitnerDeckStats) => void;
}

export const LeitnerShelf: React.FC<LeitnerShelfProps> = ({ onDeckChange }) => {
  const [deck, setDeck] = useState<LeitnerCard[]>([]);
  const [stats, setStats] = useState<LeitnerDeckStats>({
    totalCards: 0,
    dueTodayCount: 0,
    boxCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    masteredCount: 0,
    successRatePercentage: 100,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [originalMistake, setOriginalMistake] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [explanationFa, setExplanationFa] = useState("");
  const [category, setCategory] = useState("grammar");

  const refreshDeck = () => {
    const loaded = getLeitnerDeck();
    const calculated = calculateDeckStats(loaded);
    setDeck(loaded);
    setStats(calculated);
    if (onDeckChange) {
      onDeckChange(calculated);
    }
  };

  useEffect(() => {
    refreshDeck();
  }, []);

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalMistake.trim() || !correctedText.trim()) return;

    const catLabels: Record<string, string> = {
      grammar: "دستور زبان (Grammar)",
      vocabulary: "واژگان (Vocabulary)",
      pronunciation: "تلفظ و استرس (Pronunciation)",
      l1_persian: "تداخل فارسی (L1 Transfer)",
      collocation: "همایندها (Collocations)",
    };

    addCustomMistakeCard({
      originalMistake: originalMistake.trim(),
      correctedText: correctedText.trim(),
      explanationFa: explanationFa.trim(),
      category,
      categoryLabelFa: catLabels[category] || "خطای سفارشی",
      sourceTitle: "دفترچه شخصی زبان‌آموز",
    });

    setOriginalMistake("");
    setCorrectedText("");
    setExplanationFa("");
    setIsModalOpen(false);
    refreshDeck();
  };

  const boxLevels: LeitnerBoxLevel[] = [1, 2, 3, 4, 5];

  return (
    <div className={styles.shelfContainer} aria-label="سیستم جعبه لایتنر خطاهای یادگیری">
      {/* Header */}
      <div className={styles.shelfHeader}>
        <div className={styles.shelfTitleGroup}>
          <span className={styles.shelfIcon} role="img" aria-label="جعبه لایتنر">
            🗃️
          </span>
          <div>
            <h2 className={styles.shelfTitle}>جعبه ۵ خانه‌ای لایتنر خطاهای یادگیری (Mistake SRS)</h2>
            <p className={styles.shelfSubtitle}>
              انتقال فعال خطاهای مکالمه، آزمون و کلاس از حافظه فرّار به تسلط دائمی از طریق مرور با فواصل زمانی
            </p>
          </div>
        </div>
        <div className={styles.shelfActions}>
          <button
            type="button"
            className={styles.addMistakeButton}
            onClick={() => setIsModalOpen(true)}
          >
            <span>+</span>
            <span>ثبت خطای جدید</span>
          </button>
        </div>
      </div>

      {/* Due Today Callout */}
      <div className={styles.dueTodayBanner}>
        <div className={styles.dueTodayContent}>
          <div className={styles.duePulseBadge}>
            {stats.dueTodayCount}
          </div>
          <div>
            <h3 className={styles.dueTextTitle}>
              {stats.dueTodayCount > 0
                ? `${stats.dueTodayCount} کارت موعد مرور امروز داری!`
                : "تمام کارت‌های امروز مرور شده‌اند 🎉"}
            </h3>
            <p className={styles.dueTextSub}>
              {stats.dueTodayCount > 0
                ? "با مرور فعال ۵ دقیقه‌ای امروز، از فراموشی و بازگشت خطاهای تکراری جلوگیری کن."
                : "هیچ کارتی در نوبت مرور نیست؛ می‌توانید به استراحت بپردازید یا کارت‌ها را آزاد تمرین کنید."}
            </p>
          </div>
        </div>

        <Link
          href="/mistakes/leitner"
          className={styles.startStudyButton}
        >
          <span>🎯</span>
          <span>
            {stats.dueTodayCount > 0 ? "شروع مرور کارت‌های موعد امروز" : "ورود به اتاق تمرین لایتنر"}
          </span>
          <span aria-hidden="true">←</span>
        </Link>
      </div>

      {/* 5 Boxes Shelf Grid */}
      <div className={styles.boxesGrid}>
        {boxLevels.map((lvl) => {
          const meta = LEITNER_BOX_META[lvl];
          const count = stats.boxCounts[lvl] || 0;
          const percentage = stats.totalCards > 0 ? (count / stats.totalCards) * 100 : 0;

          return (
            <div key={lvl} className={styles.boxCard}>
              <div
                className={styles.boxAccentBar}
                style={{ backgroundColor: meta.color }}
              />
              <div className={styles.boxCardHeader}>
                <span
                  className={styles.boxNumberBadge}
                  style={{ backgroundColor: meta.color }}
                >
                  جعبه {lvl}
                </span>
                <span className={styles.boxIntervalText}>{meta.intervalDescFa}</span>
              </div>

              <div className={styles.boxTitleFa}>{meta.labelFa.split(":")[1]?.trim() || meta.labelFa}</div>

              <div className={styles.boxCardCount}>
                <span>{count}</span>
                <span className={styles.boxCardCountUnit}>کارت</span>
              </div>

              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for adding custom mistake */}
      {isModalOpen && (
        <div className={styles.modalOverlay} role="dialog" aria-modal="true">
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>ثبت خطای جدید در جعبه ۱ لایتنر</h3>
            <p className={styles.shelfSubtitle}>
              جمله‌ای که در آزمون یا مکالمه اشتباه گفتی را یادداشت کن تا سیستم به مرور زمان آن را تثبیت کند.
            </p>

            <form onSubmit={handleAddMistake} style={{ marginTop: "1.25rem" }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>دسته‌بندی خطا</label>
                <select
                  className={styles.formSelect}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="grammar">دستور زبان (Grammar)</option>
                  <option value="l1_persian">تداخل زبان مادری فارسی (L1 Transfer)</option>
                  <option value="collocation">همایند واژگان (Collocation)</option>
                  <option value="vocabulary">انتخاب واژه نادرست (Vocabulary)</option>
                  <option value="pronunciation">تلفظ و تکیه هجایی (Pronunciation)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>❌ جمله دارای خطا (انگلیسی)</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  placeholder="e.g. I am agree with your point."
                  value={originalMistake}
                  onChange={(e) => setOriginalMistake(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>✅ ساختار صحیح و بومی (انگلیسی)</label>
                <input
                  type="text"
                  dir="ltr"
                  className={styles.formInput}
                  placeholder="e.g. I agree with your point."
                  value={correctedText}
                  onChange={(e) => setCorrectedText(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>💡 توضیح یا ریشه‌یابی به فارسی (اختیاری)</label>
                <textarea
                  className={styles.formTextarea}
                  rows={3}
                  placeholder="دلیل اشتباه: در فارسی می‌گوییم موافق هستم، اما در انگلیسی agree خودش فعل است..."
                  value={explanationFa}
                  onChange={(e) => setExplanationFa(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.addMistakeButton}
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className={styles.startStudyButton}
                  style={{ background: "#2563eb", color: "#ffffff" }}
                >
                  افزودن به جعبه ۱
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
