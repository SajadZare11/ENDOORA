"use client";

import React, { useState, useMemo } from "react";
import {
  CEFRLevel,
  CEFRWord,
  LeitnerBoxLevel,
  LEITNER_BOX_META,
  CEFRCardState,
} from "../../../data/cefr/types";
import { getVocabForLevel } from "../../../data/cefr";
import { getLevelDeck } from "../../../lib/cefr-leitner-storage";
import { playEnglishSpeech } from "../../../lib/speech";
import styles from "./leitner.module.css";

interface CefrVocabTableProps {
  level: CEFRLevel;
  onStudyWord: (word: CEFRWord) => void;
}

export const CefrVocabTable: React.FC<CefrVocabTableProps> = ({ level, onStudyWord }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [boxFilter, setBoxFilter] = useState<string>("all");
  const [posFilter, setPosFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const allWords = useMemo(() => getVocabForLevel(level), [level]);
  const deck = useMemo(() => getLevelDeck(level), [level]);

  // Filtered words
  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return allWords.filter((w) => {
      // Search filter
      if (q) {
        const matchesWord = w.word.toLowerCase().includes(q);
        const matchesMeaning = w.meaningFa.includes(q);
        const matchesExample = w.practicalExample?.sentenceEn.toLowerCase().includes(q);
        if (!matchesWord && !matchesMeaning && !matchesExample) return false;
      }

      // Box filter
      if (boxFilter !== "all") {
        const card: CEFRCardState | undefined = deck[w.id];
        if (boxFilter === "unlearned") {
          if (card) return false;
        } else {
          const targetBox = Number(boxFilter) as LeitnerBoxLevel;
          if (!card || card.boxLevel !== targetBox) return false;
        }
      }

      // POS filter
      if (posFilter !== "all" && w.partOfSpeech !== posFilter) {
        return false;
      }

      return true;
    });
  }, [allWords, deck, searchQuery, boxFilter, posFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedWords = filteredWords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePronounce = (wordText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playEnglishSpeech(wordText, { accent: "en-US", rate: 0.92 });
  };

  return (
    <div className={styles.tableContainer} aria-label="فهرست و کاوشگر واژگان لایتنر">
      <div className={styles.tableHeaderSection}>
        <div>
          <h3 className={styles.tableMainTitle}>
            📖 بانک و کاوشگر واژگان سطح {level} ({filteredWords.length} واژه)
          </h3>
          <p className={styles.tableSubtitle}>
            جستجو، فیلتر بر اساس خانه‌های لایتنر، پخش صوت نیتیو و ورود به تدریس استقرایی هر واژه
          </p>
        </div>

        {/* Search Input */}
        <div className={styles.tableSearchBox}>
          <input
            type="text"
            className={styles.tableSearchInput}
            placeholder="🔍 جستجوی کلمه انگلیسی یا معنی فارسی..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className={styles.filtersBar}>
        <div className={styles.filterChipGroup}>
          <span className={styles.filterGroupLabel}>وضعیت لایتنر:</span>
          <button
            type="button"
            className={`${styles.filterChip} ${boxFilter === "all" ? styles.filterChipActive : ""}`}
            onClick={() => {
              setBoxFilter("all");
              setPage(1);
            }}
          >
            همه
          </button>
          <button
            type="button"
            className={`${styles.filterChip} ${boxFilter === "unlearned" ? styles.filterChipActive : ""}`}
            onClick={() => {
              setBoxFilter("unlearned");
              setPage(1);
            }}
          >
            هنوز یادنگرفته
          </button>
          {[1, 2, 3, 4, 5].map((b) => {
            const meta = LEITNER_BOX_META[b as LeitnerBoxLevel];
            return (
              <button
                key={b}
                type="button"
                className={`${styles.filterChip} ${boxFilter === String(b) ? styles.filterChipActive : ""}`}
                onClick={() => {
                  setBoxFilter(String(b));
                  setPage(1);
                }}
              >
                {meta.icon} خانه {b}
              </button>
            );
          })}
        </div>

        {/* POS Filter */}
        <div className={styles.posSelectWrapper}>
          <select
            className={styles.posSelect}
            value={posFilter}
            onChange={(e) => {
              setPosFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">همه نقش‌های دستوری</option>
            <option value="noun">اسم (Noun)</option>
            <option value="verb">فعل (Verb)</option>
            <option value="adjective">صفت (Adjective)</option>
            <option value="adverb">قید (Adverb)</option>
            <option value="preposition">حرف اضافه (Preposition)</option>
            <option value="pronoun">ضمیر (Pronoun)</option>
          </select>
        </div>
      </div>

      {/* Words Grid / List */}
      <div className={styles.vocabGrid}>
        {paginatedWords.length === 0 ? (
          <div className={styles.tableEmptyState}>
            <p>واژه‌ای با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          paginatedWords.map((word) => {
            const card = deck[word.id];
            const boxLevel = card?.boxLevel;
            const boxMeta = boxLevel ? LEITNER_BOX_META[boxLevel] : null;

            return (
              <div key={word.id} className={styles.vocabRowCard}>
                <div className={styles.vocabMainCol}>
                  <div className={styles.vocabTermLine}>
                    <button
                      type="button"
                      className={styles.inlineAudioBtn}
                      onClick={(e) => handlePronounce(word.word, e)}
                      title="شنیدن تلفظ"
                    >
                      🔊
                    </button>
                    <span className={styles.vocabWordBold}>{word.word}</span>
                    <span className={styles.vocabIpa}>{word.phonetic}</span>
                    <span className={styles.vocabPosPill}>{word.partOfSpeechLabelFa}</span>
                  </div>

                  <p className={styles.vocabMeaningFa}>{word.meaningFa}</p>
                  <p className={styles.vocabContextSnippet}>
                    {word.practicalExample?.sentenceEn}
                  </p>
                </div>

                <div className={styles.vocabActionCol}>
                  {boxMeta ? (
                    <span
                      className={styles.cardBoxStatus}
                      style={{
                        backgroundColor: `${boxMeta.color}15`,
                        color: boxMeta.color,
                        borderColor: `${boxMeta.color}35`,
                      }}
                    >
                      {boxMeta.icon} {boxMeta.labelFa}
                    </span>
                  ) : (
                    <span className={styles.cardUnlearnedStatus}>🌱 جدید / در صف</span>
                  )}

                  <button
                    type="button"
                    className={styles.teachWordButton}
                    onClick={() => onStudyWord(word)}
                  >
                    تدریس استقرایی 💡
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={styles.paginationBar}>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← صفحه قبلی
          </button>
          <span className={styles.paginationInfo}>
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            صفحه بعدی →
          </button>
        </div>
      )}
    </div>
  );
};
