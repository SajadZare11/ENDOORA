"use client";

import { useState } from "react";
import type { QuickToolItem } from "@/data/skills/skills-content";
import styles from "./skills-components.module.css";

interface SkillQuickToolkitProps {
  sectionTitleFa: string;
  sectionDescFa: string;
  items: QuickToolItem[];
}

export function SkillQuickToolkit({
  sectionTitleFa,
  sectionDescFa,
  items,
}: SkillQuickToolkitProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }
    } catch {
      // Fallback: ignore clipboard failure
    }
  };

  return (
    <section id="quick-toolkit" className={styles.section} aria-labelledby="toolkit-title">
      <header className={styles.sectionHeader}>
        <div className={styles.sectionBadge}>⚡ ستون اول: کاربردی و آماده‌مصرف</div>
        <h2 id="toolkit-title" className={styles.sectionTitle}>
          {sectionTitleFa}
        </h2>
        <p className={styles.sectionDesc}>
          {sectionDescFa}
        </p>
      </header>

      <div className={styles.toolkitGrid}>
        {items.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div key={item.id} className={styles.toolkitCard}>
              <div>
                <div className={styles.toolkitTopRow}>
                  <span className={styles.toolkitTag}>{item.categoryTag}</span>
                  <button
                    type="button"
                    className={`${styles.copyBtn} ${isCopied ? styles.copyBtnCopied : ""}`}
                    onClick={() => handleCopy(item.id, item.phraseEn)}
                    aria-label={`کپی عبارت ${item.phraseEn}`}
                  >
                    <span>{isCopied ? "✓ کپی شد" : "کپی"}</span>
                  </button>
                </div>

                <div className={styles.phraseEnBox}>
                  {item.phraseEn}
                </div>

                <div className={styles.phraseFaBox}>
                  {item.phraseFa}
                </div>

                <p className={styles.phraseContext}>
                  📌 <strong>کجا بگیم؟</strong> {item.contextFa}
                </p>
              </div>

              {item.pronunciationTipFa && (
                <div className={styles.pronunciationBox}>
                  <span aria-hidden="true">🗣️</span>
                  <span>{item.pronunciationTipFa}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
